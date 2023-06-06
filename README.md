# urlaccess-ubuntu-2204

## Install

Install Node 18 (or newer).

    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt install -y nodejs

Setup app.

    # upload urlaccess source -> /home/urlaccess/urlaccess

    cd /home/urlaccess/urlaccess
    npm ci
    npm run build

Setup service.

    # move files/urlaccess-sudoers -> /etc/sudoers.d/nojump-sudoers
    # move files/urlaccess.service -> /usr/lib/systemd/system/urlaccess.service 

    adduser \
    --system
    --shell /bin/bash \
    --group \
    --disabled-password \
    --home /home/urlaccess \
    urlaccess

	systemctl enable urlaccess.service
	systemctl start urlaccess.service

Setup firewall.

    ufw enable
	ufw allow 8022
	ufw default reject incoming
	ufw default allow outgoing
	ufw default deny routed
