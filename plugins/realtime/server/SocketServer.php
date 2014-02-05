<?php
/**
 * Simple WebSocket server implementation.
 *
 * Copyright (C) <2012> by <Priit Kallas>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Based on snippets from http://code.google.com/p/phpwebsocket/
 * and http://bohuco.net/blog/2010/07/html5-websockets-example/.
 *
 * @author Priit Kallas <kallaspriit@gmail.com>
 * @package WebSocket
 */

/**
 * Socket server listener interface.
 *
 * Implement this to communicate with the socket server.
 *
 * @author Priit Kallas <kallaspriit@gmail.com>
 * @package WebSocket
 */
interface SocketListener {
    
	public function onIdle(
		SocketServer $server
	);    

	/**
	 * Called when a client sends a message to the server.
	 *
	 * @param SocketServer $server The server instance
	 * @param SocketClient $client Client that sent the message
	 * @param string $message Sent message
	 */
	public function onMessageReceived(
		SocketServer $server,
		SocketClient $sender,
		$message
	);

	/**
	 * Called when a new client connects to the server.
	 *
	 * @param SocketServer $server The server instance
	 * @param SocketClient $client Client that connected
	 */
	public function onClientConnected(
		SocketServer $server,
		SocketClient $client
	);

	/**
	 * Called when a  client disconnects from the server.
	 *
	 * @param SocketServer $server The server instance
	 * @param SocketClient $client Client that disconnected
	 */
	public function onClientDisconnected(
		SocketServer $server,
		SocketClient $client
	);

	/**
	 * Called when the server generates a log message.
	 *
	 * @param SocketServer $server The server
	 * @param string $message Log message
	 */
	public function onLogMessage(
		SocketServer $server,
		$message
	);
}

/**
 * Simple WebSocket server.
 *
 * @author Priit Kallas <kallaspriit@gmail.com>
 * @package WebSocket
 */
Class SocketServer {

	/**
	 * Host to bind to.
	 *
	 * @var string
	 */
	protected $host;

	/**
	 * Port number where to bind to.
	 *
	 * @var integer
	 */
	protected $port;

	/**
	 * Array of connected clients.
	 *
	 * @var SocketClient[]
	 */
	protected $clients = array();

	/**
	 * The master socket acting as server.
	 *
	 * @var resource
	 */
	protected $socket;

	/**
	 * Array of all connected sockets, includes the master.
	 *
	 * @var resource[]
	 */
	protected $sockets = array();

	/**
	 * Array of socket listeners.
	 *
	 * @var SocketListener[]
	 */
	protected $listeners = array();

	const FIN                  = 128;
	const MASK                 = 128;
	const OPCODE_CONTINUATION  = 0;
	const OPCODE_TEXT          = 1;
	const PAYLOAD_LENGTH_16    = 126;
	const PAYLOAD_LENGTH_63    = 127;

	/**
	 * Constructor, sets host and port to bind to.
	 *
	 * @param string $host Socket host to bind to, defaults to localhost
	 * @param integer $port Port to bind to, defaults to 8080
	 */
	public function __construct(
		$host = '127.0.0.1',
		$port = 8080
	) {
		$this->host = $host;
		$this->port = $port;
        
        echo $host."\n";
	}

	/**
	 * Adds a new socket listener.
	 *
	 * @param SocketListener $listener Listener to add
	 */
	public function addListener(SocketListener $listener) {
		$this->listeners[] = $listener;
	}

	/**
	 * Removes an existing socket listener.
	 *
	 * @param SocketListener $listener Listener to remove
	 * @return boolean Was the listener removed, false if not found
	 */
	public function removeListener(SocketListener $listener) {
		foreach ($this->listeners as $key => $socketListener) {
			if ($socketListener == $listener) {
				unset($this->listeners[$key]);

				return true;
			}
		}

		return false;
	}

	/**
	 * Returns all added socket listeners.
	 *
	 * @return SocketListener[]
	 */
	public function getListeners() {
		return $this->listeners;
	}

	/**
	 * Sets the host to use.
	 *
	 * Only has effect before starting the server.
	 *
	 * @param string $host Host to bind to
	 */
	public function setHost($host) {
		$this->host = $host;
	}

	/**
	 * Sets the host port to use.
	 *
	 * Only has effect before starting the server.
	 *
	 * @param integer $port Port to bind to
	 */
	public function setPort($port) {
		$this->port = $port;
	}

	/**
	 * Returns array of connected clients
	 *
	 * @return SocketClient[] Array of connected clients
	 */
	public function getClients() {
		return $this->clients;
	}

	/**
	 * Returns the number of connected clients
	 *
	 * @return integer Number of clients
	 */
	public function getClientCount() {
		return count($this->clients);
	}

	/**
	 * Returns last socket error as an object.
	 *
	 * The object is a basic stdClass with parameters:
	 * - code: the code of the error
	 * - message: translated error code as message
	 *
	 * @param resource $socket Optional socket resource
	 * @return stdClass Error as stdClass instance with fields code and message
	 */
	public static function getLastError($socket = null) {
		$lastErrorCode = socket_last_error($socket);
		$lastErrorMessage = socket_strerror($lastErrorCode);

		$error = new stdClass();
		$error->code = $lastErrorCode;
		$error->message = $lastErrorMessage;

		return $error;
	}

	/**
	 * Starts the server by binding to a port
	 *
	 * @param integer $maxConnections Max number of incoming backlog connections
	 * @throws Exception If something goes wrong
	 */
	public function start($maxConnections = SOMAXCONN) {
		set_time_limit(0);
		ob_implicit_flush();

		$this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

		if ($this->socket === false) {
			$error = self::getLastError();

			throw new Exception(
				'Creating socket failed: '.$error->message.' ['.$error->code.']'
			);
		}

		$this->sockets[] = $this->socket;

		if (
			socket_set_option(
				$this->socket,
				SOL_SOCKET,
				SO_REUSEADDR,
				1
			) === false
		) {
			$error = self::getLastError($this->socket);

			throw new Exception(
				'Setting socket option to reuse address to true failed: '.
				$error->message.' ['.$error->code.']'
			);
		}

		if (socket_bind($this->socket, $this->host, $this->port) === false) {
			$error = self::getLastError($this->socket);

			throw new Exception(
				'Binding to port '.$this->port.' on host "'.$this->host.
				'" failed: '.$error->message.' ['.$error->code.']'
			);
		}

		if (socket_listen($this->socket, $maxConnections) === false) {
			$error = self::getLastError($this->socket);

			throw new Exception(
				'Starting to listen on the socket on port '.$this->port.
				' and host "'.$this->host.'" failed: '.$error->message.
				' ['.$error->code.']'
			);
		}

		$this->run();
	}

	/**
	 * Runs the server as an infinite loop
	 *
	 * @return void
	 */
	protected function run() {
		while (true) {
			$changedSockets = $this->sockets;

			$write = $except = $tv = $tvu = null;
            $tv = $tvu = 0;
            
            usleep(50*1000);
            
            foreach ($this->listeners as $listener) {
                $listener->onIdle($this);
            }            
            
			$result = socket_select(
				$changedSockets,
				$write,
				$except,
				$tv,
				$tvu
			);

			if ($result === false) {
				socket_close($this->socket);

				$error = self::getLastError($this->socket);

				throw new Exception(
					'Checking for changed sockets failed: '.$error->message.
					' ['.$error->code.']'
				);
			}

			foreach ($changedSockets as $socket) {
				if ($socket == $this->socket) {
					$newSocket = socket_accept($this->socket);

					if ($newSocket !== false) {
						$this->connectClient($newSocket);
					} else {
						$error = self::getLastError($this->socket);

						trigger_error(
							'Failed to accept incoming client: '.
							$error->message.' ['.$error->code.']',
							E_USER_WARNING
						);
					}
				} else {
					$client = $this->getClientBySocket($socket);

					if (!isset($client)) {
						trigger_error(
							'Failed to match given socket to client',
							E_USER_WARNING
						);

						socket_close($socket);

						continue;
					}

					$buffer = '';
					$message = '';

					$bytes = @socket_recv($socket, $buffer, 4096, 0);

					if ($bytes === false) {
						$error = self::getLastError($this->socket);

						trigger_error(
							'Failed to receive data from client #'.$client->id.': '.
							$error->message.' ['.$error->code.']',
							E_USER_WARNING
						);

						continue;
					}

					$len = ord($buffer[1]) & 127;

					$masks = null;
					$data = null;

					if ($len === 126) {
						$masks = substr($buffer, 4, 4);
						$data = substr($buffer, 8);
					} else if ($len === 127) {
						$masks = substr($buffer, 10, 4);
						$data = substr($buffer, 14);
					} else {
						$masks = substr($buffer, 2, 4);
						$data = substr($buffer, 6);
					}

					for ($index = 0; $index < strlen($data); $index++) {
						$message .= $data[$index] ^ $masks[$index % 4];
					}

					if ($bytes == 0) {
						$this->disconnectClient($socket);
					} else {
						if ($client->state == SocketClient::STATE_OPEN) {
							$client->lastReceiveTime = time();

							$this->log('< ['.$client->id.'] '.$message);

							foreach ($this->listeners as $listener) {

								$listener->onMessageReceived(
									$this,
									$client,
									$message
								);
							}
						} else if ($client->state == SocketClient::STATE_CONNECTING) {
							$client->performHandshake($buffer);
						}
					}
				}
			}
		}
	}

	/**
	 * Connects a client by socket.
	 *
	 * Creates a new instance of the SocketClient class and adds it to the list
	 * of clients. Also adds the socket to the list of sockets.
	 *
	 * @param resource $socket Socket to use
	 */
	protected function connectClient($socket) {
		$client = new SocketClient($this, $socket);

		$this->clients[] = $client;
		$this->sockets[] = $socket;

		$this->log('+ ['.$client->id.'] connected');

		foreach ($this->listeners as $listener) {
			$listener->onClientConnected(
				$this,
				$client
			);
		}
	}

	/**
	 * Disconnects a client by socket.
	 *
	 * @param resource $clientSocket Socket to use
	 */
	public function disconnectClient($clientSocket) {
		foreach ($this->sockets as $socketKey => $socket) {
			if ($socket === $clientSocket) {
				socket_close($clientSocket);
				unset($this->sockets[$socketKey]);
			}
		}

		foreach ($this->clients as $clientKey => $client) {
			if ($client->socket === $clientSocket) {
				$this->log('- ['.$client->id.'] client disconnected');

				foreach ($this->listeners as $listener) {
					$listener->onClientDisconnected(
						$this,
						$client
					);
				}

				$this->clients[$clientKey]->state = SocketClient::STATE_CLOSED;

				unset($this->clients[$clientKey]);
			}
		}


	}

	/**
	 * Returns client by socket reference.
	 *
	 * @param resource $socket Socket resource
	 * @return SocketClient The client on the socket or null if not found
	 */
	protected function getClientBySocket($socket) {
		foreach ($this->clients as $client) {
			if ($client->socket == $socket) {
				return $client;
			}
		}

		return null;
	}

	/**
	 * Sends a message to given socket
	 *
	 * @param resource $socket Socket to send the message to
	 * @param mixed $message Message to send
	 * @param integer $bufferSize Buffer size to use
	 * @throws Exception If something goes wrong
	 */
	public function send(
		$socket,
		$message,
		$bufferSize = 4096
	) {
		$opcode = self::OPCODE_TEXT;

		if (is_object($message)) {
			$message = (string)$message;
		}

		// fetch message length
		$messageLength = strlen($message);

		// work out amount of frames to send, based on $bufferSize
		$frameCount = ceil($messageLength / $bufferSize);
		if ($frameCount == 0) $frameCount = 1;

		// set last frame variables
		$maxFrame = $frameCount - 1;
		$lastFrameBufferLength = ($messageLength % $bufferSize) != 0 ? ($messageLength % $bufferSize) : ($messageLength != 0 ? $bufferSize : 0);

		// loop around all frames to send
		for ($i=0; $i<$frameCount; $i++) {
			// fetch fin, opcode and buffer length for frame
			$fin = $i != $maxFrame ? 0 : self::FIN;
			$opcode = $i != 0 ? self::OPCODE_CONTINUATION : $opcode;

			$bufferLength = $i != $maxFrame ? $bufferSize : $lastFrameBufferLength;

			// set payload length variables for frame
			if ($bufferLength <= 125) {
				$payloadLength = $bufferLength;
				$payloadLengthExtended = '';
				$payloadLengthExtendedLength = 0;
			}
			elseif ($bufferLength <= 65535) {
				$payloadLength = self::PAYLOAD_LENGTH_16;
				$payloadLengthExtended = pack('n', $bufferLength);
				$payloadLengthExtendedLength = 2;
			}
			else {
				$payloadLength = self::PAYLOAD_LENGTH_63;
				$payloadLengthExtended = pack('xxxxN', $bufferLength); // pack 32 bit int, should really be 64 bit int
				$payloadLengthExtendedLength = 8;
			}

			// set frame bytes
			$buffer = pack('n', (($fin | $opcode) << 8) | $payloadLength) . $payloadLengthExtended . substr($message, $i*$bufferSize, $bufferLength);

			// send frame
			$socket = $socket;

			$left = 2 + $payloadLengthExtendedLength + $bufferLength;
			do {
				$sent = @socket_send($socket, $buffer, $left, 0);
				if ($sent === false) return false;

				$left -= $sent;
				if ($sent > 0) $buffer = substr($buffer, $sent);
			}
			while ($left > 0);
		}

		$client = $this->getClientBySocket($socket);

		$clientId = -1;

		if ($client != null) {
			$client->lastSendTime = time();
			$clientId = $client->id;
		}

		$this->log('> ['.$clientId.'] '.$message);

		return true;
	}

	/**
	 * Logs a message to console
	 *
	 * @param string $message Message to log
	 */
	public function log($message) {
		foreach ($this->listeners as $listener) {
			$listener->onLogMessage(
				$this,
				$message
			);
		}
	}

}

/**
 * Class representing a WebSocket client.
 */
class SocketClient {

	/**
	 * Number of instances created.
	 *
	 * @var integer
	 */
	static $instances = 0;

	/**
	 * Reference to server that created the client.
	 *
	 * @var SocketServer
	 */
	public $server;

	/**
	 * Client id.
	 *
	 * This starts from one and is incremented for every connecting user.
	 *
	 * @var integer
	 */
	public $id;

	/**
	 * Client socket.
	 *
	 * @var resource
	 */
	public $socket;

	/**
	 * Client state.
	 *
	 * One of SocketClient::STATE_.. constants.
	 *
	 * @var integer
	 */
	public $state;

	/**
	 * The ip of the client.
	 *
	 * @var string
	 */
	public $ip;

	/**
	 * The port of the client.
	 *
	 * @var integer
	 */
	public $port;

	/**
	 * The time data was last recieved from the client.
	 *
	 * @var integer
	 */
	public $lastReceiveTime = 0;

	/**
	 * Last time data was sent to this client.
	 *
	 * @var integer
	 */
	public $lastSendTime = 0;

	/**
	 * Any data associated with the user.
	 *
	 * @var mixed
	 */
	public $data = array();

	/**
	 * User is connecting, handshake not yet performed.
	 */
	const STATE_CONNECTING = 0;

	/**
	 * Connection is valid.
	 */
	const STATE_OPEN       = 1;

	/**
	 * Connection has been closed.
	 */
	const STATE_CLOSED     = 2;

	/**
	 * Constructor, sets the server that spawned the client and the socket.
	 *
	 * @param SocketServer $server Parent server
	 * @param resource $socket User socket
	 * @param integer $state Initial state
	 */
	public function __construct(
		SocketServer $server,
		$socket,
		$state = self::STATE_CONNECTING
	) {
		self::$instances++;

		$this->server = $server;
		$this->id = self::$instances;
		$this->socket = $socket;
		$this->state = $state;
		$this->lastReceiveTime = time();

		socket_getpeername($socket, $this->ip, $this->port);
	}

	/**
	 * Sends a message to the client
	 *
	 * @param mixed $message Message to send
	 */
	public function send($message) {
		if ($this->state == self::STATE_CLOSED) {
			throw new Exception(
				'Unable to send message, connection has been closed'
			);
		}
        if (!is_string($message)) $message = json_encode($message);
		$this->server->send($this->socket, $message);
	}

	/**
	 * Sets client property.
	 *
	 * @param string $name Property name
	 * @param mixed $value Property value
	 */
	public function set($name, $value) {
		$this->data[$name] = $value;
	}

	/**
	 * Returns client property.
	 *
	 * @param string $name Name of the property
	 * @param mixed $default Default value returned when property does not exist
	 * @return mixed
	 */
	public function get($name, $default = null) {
		if (array_key_exists($name, $this->data)) {
			return $this->data[$name];
		} else {
			return $default;
		}
	}

	/**
	 * Disconnects the client.
	 */
	public function disconnect() {
		if ($this->state == self::STATE_CLOSED) {
			return;
		}

		$this->server->disconnectClient($this->socket);
	}

	/**
	 * Does the magic handshake to begin the connection
	 *
	 * @param string $buffer Buffer sent by the client
	 * @return bool Was the handshake successful
	 * @throws Exception If something goes wrong
	 */
	public function performHandshake($buffer) {
		if ($this->state != self::STATE_CONNECTING) {
			throw new Exception(
				'Unable to perform handshake, client is not in connecting state'
			);
		}

		$this->headers = $headers = $this->parseRequestHeader($buffer);
        
		$key = $headers['Sec-WebSocket-Key'];
		$hash = base64_encode(
			sha1($key.'258EAFA5-E914-47DA-95CA-C5AB0DC85B11', true)
		);

		$headers = array(
			'HTTP/1.1 101 Switching Protocols',
			'Upgrade: websocket',
			'Connection: Upgrade',
			'Sec-WebSocket-Accept: '.$hash
		);

		$headers = implode("\r\n", $headers)."\r\n\r\n";

		$left = strlen($headers);

		do {
			$sent = @socket_send($this->socket, $headers, $left, 0);

			if ($sent === false) {
				$error = $this->server->getLastError();

				throw new Exception(
					'Sending handshake failed: : '.$error->message.
					' ['.$error->code.']'
				);
			}

			$left -= $sent;

			if ($sent > 0) {
				$headers = substr($headers, $sent);
			}
		}
		while ($left > 0);

		$this->state = self::STATE_OPEN;
	}

	/**
	 * Parses the request header into resource, headers and security code
	 *
	 * @param string $request The request
	 * @return array Array containing the resource, headers and security code
	 */
	private function parseRequestHeader($request) {
		$headers = array();

		foreach (explode("\r\n", $request) as $line) {
			if (strpos($line, ': ') !== false) {
				list($key, $value) = explode(': ', $line);

				$headers[trim($key)] = trim($value);
			}
		}

		return $headers;
	}

}