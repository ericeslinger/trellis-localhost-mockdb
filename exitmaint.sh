#!/bin/bash
/home/flo/.nvm/versions/node/v6.3.0/bin/forever start "dist/backend/server.js"
/home/flo/.nvm/versions/node/v6.3.0/bin/forever start "dist/backend/notifyProcess.js"
sudo rm /etc/nginx/sites-enabled/trellis-maintenance
sudo ln -s /etc/nginx/sites-available/trellis-enabled /etc/nginx/sites-enabled
sudo service nginx restart
