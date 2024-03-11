.PHONY = all dev
include .env

all: 
	npm run build

dev: 
	npm run dev
	
clean:
	npm run clean
