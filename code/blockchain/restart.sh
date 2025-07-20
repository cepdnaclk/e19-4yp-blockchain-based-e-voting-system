find ./ -type f -name "*.sh" -exec dos2unix {} +

./stop.sh

sleep 3

./start.sh
