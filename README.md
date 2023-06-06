# urlaccess-ubuntu-2204

System service for securely allowing URL access to internet-facing sites.

## Install

Install Node 18 (or newer).

    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt -y install nodejs

Setup app.

    adduser \
    --system
    --shell /bin/bash \
    --group \
    --disabled-password \
    --home /home/urlaccess \
    urlaccess

    # upload urlaccess source -> /home/urlaccess/urlaccess

    cd /home/urlaccess/urlaccess
    npm ci
    npm run build

    cp .env.example .env

Setup service.

    # move files/urlaccess-sudoers -> /etc/sudoers.d/urlaccess-sudoers

    chown root:root /etc/sudoers.d/urlaccess-sudoers
    chmod 440 /etc/sudoers.d/urlaccess-sudoers

    # move files/urlaccess.service -> /usr/lib/systemd/system/urlaccess.service

	systemctl enable urlaccess.service
	systemctl start urlaccess.service

Setup firewall.

    ufw enable
	ufw allow 8022
	ufw default reject incoming
	ufw default allow outgoing
	ufw default deny routed
