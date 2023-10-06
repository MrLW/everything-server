import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import  config from '../../config/local'

@Injectable()
export class RedisService {
    private readonly redisClient: Redis;

    constructor(){
        this.redisClient = new Redis(config.redis);
    }

    setValue(key: string, value: string){
        return this.redisClient.set(key, value);
    }
    
    getValue(key: string) {
        return this.redisClient.get(key);
    }

    setex(key: string, seconds: number, value: string, ){
        return this.redisClient.setex(key, seconds, value)
    }

    del(key: string){
        return this.redisClient.del(key)
    }
    
}
