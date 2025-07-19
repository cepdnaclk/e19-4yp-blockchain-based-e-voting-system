cd ./artifacts
docker-compose down -v

sleep 2

cd ../Explorer
docker-compose down -v

sleep 2

docker volume prune -f

sleep 2

docker system prune -f
