#!/bin/bash
/home/flo/.nvm/versions/node/v6.3.0/bin/forever stopall
sudo rm /etc/nginx/sites-enabled/trellis-enabled
sudo ln -s /etc/nginx/sites-available/trellis-maintenance /etc/nginx/sites-enabled
sudo service nginx restart
