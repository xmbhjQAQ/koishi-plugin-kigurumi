import { Context, Schema } from 'koishi'

export const name = 'kigurumi'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // write your plugin here
  ctx.command('头壳进度 <order_number:string>')
    .action(async ({ session }, order_number) => {
      if (!order_number) {
        session.send('请提供订单编号。');
        return;
      }
      try {
        const response = await fetch(`https://kigurumi.shamiko.cc/?order_number=${order_number}`);
        if (response.status === 500) {
          session.send('订单编号不合法，请检查后重新输入。');
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const result = {
          productionBatch: data['生产批次'],
          id: data['ID'],
          orderNumber: data['订单编号'],
          currentProgress: data['当前进度'],
          description: data['描述'],
          updateTime: data['更新时间']
        };
        const message = `
生产批次: ${result.productionBatch}
ID: ${result.id}
订单编号: ${result.orderNumber}
当前进度: ${result.currentProgress}
描述: ${result.description}
更新时间: ${result.updateTime}
        `;
        console.log(result);
        session.send(message.trim());
      } catch (error) {
        console.error('Error fetching data:', error);
        session.send('获取订单信息时出错，请稍后再试。');
      }
    });
}