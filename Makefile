up: 
	docker compose up -d
clean:
	docker compose down
	docker compose rm
fclean:
	docker compose down
	docker compose rm
	docker system prune -af --volumes
re: fclean up
.PHONY: all up fclean re