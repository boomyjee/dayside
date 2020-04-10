#include <unistd.h>
#include <sys/select.h>
#include <sys/wait.h>
#include <stdio.h>
#include <pty.h>
#include <stdlib.h>
#include <termios.h>
#include <unistd.h>
#include <fcntl.h>

extern char **environ;
struct termios orig_termios;

static void set_fds(fd_set *reads, int pttyno) {
	FD_ZERO(reads);
	FD_SET(0, reads);
	FD_SET(pttyno, reads);
}

void die(const char *s) {
    perror(s);
    exit(1);
}

void disableRawMode() {
    if (tcsetattr(STDIN_FILENO, TCSAFLUSH, &orig_termios) == -1) die("tcsetattr");
}

void enableRawMode() {
    if (tcgetattr(STDIN_FILENO, &orig_termios) == -1) die("tcgetattr");
    atexit(disableRawMode);
    struct termios raw = orig_termios;
    raw.c_iflag &= ~(BRKINT | ICRNL | INPCK | ISTRIP | IXON);
    raw.c_oflag &= ~(OPOST);
    raw.c_cflag |= (CS8);
    raw.c_lflag &= ~(ECHO | ICANON | IEXTEN | ISIG);
    raw.c_cc[VMIN] = 0;
    raw.c_cc[VTIME] = 1;
    if (tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw) == -1) die("tcsetattr");
}

int main(int argc, char *argv[]) {
	char buf[1024];
	int pttyno, n = 0;
	int pid;
	struct winsize winsz;
	
	if (argc < 3) {
		fprintf(stderr, "Usage: %s <rows> <cols> <cmd> [args]\n", argv[0]);
		return 1;
	}

    // termios
    struct termios t;
    struct termios *term = &t;
    term->c_iflag = ICRNL | IXON | IXANY | IMAXBEL | BRKINT | IUTF8;
    term->c_oflag = OPOST | ONLCR;
    term->c_cflag = CREAD | CS8 | HUPCL;
    term->c_lflag = ICANON | ISIG | IEXTEN | ECHO | ECHOE | ECHOK | ECHOKE | ECHOCTL;

    term->c_cc[VEOF] = 4;
    term->c_cc[VEOL] = -1;
    term->c_cc[VEOL2] = -1;
    term->c_cc[VERASE] = 0x7f;
    term->c_cc[VWERASE] = 23;
    term->c_cc[VKILL] = 21;
    term->c_cc[VREPRINT] = 18;
    term->c_cc[VINTR] = 3;
    term->c_cc[VQUIT] = 0x1c;
    term->c_cc[VSUSP] = 26;
    term->c_cc[VSTART] = 17;
    term->c_cc[VSTOP] = 19;
    term->c_cc[VLNEXT] = 22;
    term->c_cc[VDISCARD] = 15;
    term->c_cc[VMIN] = 1;
    term->c_cc[VTIME] = 0;

    cfsetispeed(term, B38400);
    cfsetospeed(term, B38400);

	winsz.ws_row = atoi(argv[1]);
	winsz.ws_col = atoi(argv[2]);
	winsz.ws_xpixel = 0;
	winsz.ws_ypixel = 0;
	
	pid = forkpty(&pttyno, NULL, term, &winsz);
	if (pid < 0) {
		die("Cannot forkpty");
	} else if (pid == 0) {
		execvp(argv[3], argv + 3);
		die("Cannot exec cmd");
	}

	fd_set reads;
	set_fds(&reads, pttyno);

    int flags = fcntl(STDIN_FILENO, F_GETFL, 0);
    fcntl(STDIN_FILENO, F_SETFL, flags | O_NONBLOCK);    

    enableRawMode();

	while (select(pttyno + 1, &reads, NULL, NULL, NULL)) {
		if (FD_ISSET(0, &reads)) {
			n = read(0, buf, sizeof buf);
			if (n == 0) {
				return 0;
			} else if (n < 0) {
				perror("Could not read from stdin");
				return 1;
			}

            int sendAsIs = 1;
            for (int i=0;i<n;i++) {
                if (buf[i] == 0x07 && i+4<n) {
                    int rows = (int)buf[i+1]*100+(int)buf[i+2];
                    int cols = (int)buf[i+3]*100+(int)buf[i+4];

                    struct winsize winp;
                    winp.ws_col = cols;
                    winp.ws_row = rows;
                    winp.ws_xpixel = 0;
                    winp.ws_ypixel = 0;

                    ioctl(pttyno, TIOCSWINSZ, &winp);

                    if (i>0) write(pttyno, buf, i);
                    write(pttyno, buf+i+5, n-i-5);
                    sendAsIs = 0;
                    break;
                }
            }
			if (sendAsIs) write(pttyno, buf, n);
		}
		
		if (FD_ISSET(pttyno, &reads)) {
			n = read(pttyno, buf, sizeof buf);
			if (n == 0) {
				return 0;
			} else if (n < 0) {
				return 0;
			}
			write(1, buf, n);
		}
		
		set_fds(&reads, pttyno);
	}
	
	int statloc;
	wait(&statloc);
	
	return 0;
}