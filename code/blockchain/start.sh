dos2unix ./artifacts/channel/create-artifacts.sh
dos2unix ./createChannel.sh
dos2unix ./deployChaincode.sh
dos2unix ./api-2.0/config/generate-ccp.sh

sleep 2

cd ./artifacts/channel
echo "Current directory" 
pwd
./create-artifacts.sh
cd ../../
echo "Current directory" 
pwd

docker-compose -f ./artifacts/docker-compose.yaml up -d

sleep 2
./createChannel.sh

sleep 2
cd ./artifacts/src
go mod download github.com/hyperledger/fabric
go mod tidy
go mod vendor
cd ../../

sleep 2
./deployChaincode.sh

sleep 2
cd ./api-2.0/config
echo "Current directory" 
pwd
./generate-ccp.sh
cd ../../   
echo "Current directory"
pwd


sleep 2
rm -rf ./Explorer/crypto-config
ls -lh ./Explorer
cp -r ./artifacts/channel/crypto-config ./Explorer   
ls -lh ./Explorer
cd ./Explorer
docker-compose up -d

sleep 2
echo "Hyperledger Explorer is running at http://localhost:8080"

sleep 2
cd ../api-2.0
npm install
npm run dev



