# Connect to Redis
import redis.asyncio as aioredis

store = aioredis.Redis(
  host='redis-15192.c52.us-east-1-4.ec2.redns.redis-cloud.com',
  port=15192,
  password='P2W4nSAellBviknuDeUaj8QcxPRy6W7B'
)