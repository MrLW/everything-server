import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENT_NAME } from "./constant";
import { jwtConstants } from "src/common/constants";
import { JwtService } from "@nestjs/jwt";

const socketMap = {};

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{

  constructor(private readonly jwtService: JwtService){}

  handleDisconnect(client: Socket) {
    delete socketMap[client.id]
    Logger.log(`【${client.id}handleDisconnect...`);

  }

  
  handleConnection(client: Socket, ...args: any[]) {
    Logger.log(`【${client.id}】handleConnection...`, args);
  }

  @WebSocketServer()
  private server: Server

  @SubscribeMessage(`${SOCKET_EVENT_NAME.USER_LOGIN}`)
  async initUser(@MessageBody("token") token: string, @ConnectedSocket() socket: Socket) {
    // 解析token, 
    const user = await this.jwtService.verifyAsync(
        token,
        {
            secret: jwtConstants.secret
        }
    );

    socketMap[socket.id] = user.id;
    Logger.log(`socket login:${ user.id } -- ${socket.id} `)
  }

  /**
   * 发送事件
   * @param userId 用户id
   * @param eventName 事件名称
   * @param data 数据
   */
  async emit(userId: number, eventName: string, data: any): Promise<void> {
    const sockets = await this.server.of('').sockets;
    sockets.forEach(function (socket, sid) {
      Logger.log(sid);
      if(userId == socketMap[sid]) {
        Logger.log(`${userId} 将会收到事件(${eventName})`);
        const res =  sockets.get(sid).emit(eventName, data);
      }
    })
  }
}