SHELL := /bin/bash

create:
	docker-compose build && docker-compose up -d
delete:
	if [ -n "$$(docker ps -aqf ancestor=gelignite/fda_node_bank)" ] && [ -n "$$(docker ps -aqf ancestor=gelignite/fda_javascript_bank)" ]; then \
		docker stop $$(docker ps -aqf ancestor=gelignite/fda_node_bank) && docker rm $$(docker ps -aqf ancestor=gelignite/fda_node_bank); \
		docker stop $$(docker ps -aqf ancestor=gelignite/fda_javascript_bank) && docker rm $$(docker ps -aqf ancestor=gelignite/fda_javascript_bank); \
	fi; \
	if [ -n "$$(docker images -q gelignite/fda_node_bank)" ] && [ -n "$$(docker images -q gelignite/fda_javascript_bank)" ]; then \
		docker rmi gelignite/fda_node_bank gelignite/fda_javascript_bank; \
	fi
deleteAll:
	docker stop $$(docker ps -aq) && docker rm $$(docker ps -aq) && docker rmi $$(docker images -aq)
logs:
	docker-compose logs
network:
	docker network inspect bank