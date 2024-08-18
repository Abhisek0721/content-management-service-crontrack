import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get()
  index(@Req() req: Request, @Res() res: Response) {
    return res.send(
      `
        <body style="background-color: #1b1b32; color: #fff;">
            <h1 style="font-family: sans-serif;"> Running on Port: ${process.env.PORT} </h1>
        </body>
        `,
    );
  }
}