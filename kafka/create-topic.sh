#!/bin/bash

# Kafka container name
KAFKA_CONTAINER="kafka"

# Kafka topic name
TOPIC_NAME="ride-requests"

# Number of partitions
PARTITIONS=3

# Replication factor
REPLICATION_FACTOR=1

echo "Creating Kafka topic: $TOPIC_NAME ..."

docker exec -it $KAFKA_CONTAINER /usr/bin/kafka-topics --create \
  --topic $TOPIC_NAME \
  --bootstrap-server localhost:9092 \
  --partitions $PARTITIONS \
  --replication-factor $REPLICATION_FACTOR

echo "Topic $TOPIC_NAME created successfully!"
