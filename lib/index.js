var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  name: () => name
});
module.exports = __toCommonJS(src_exports);
var import_koishi = require("koishi");
var name = "kigurumi";
var Config = import_koishi.Schema.object({});
function apply(ctx) {
  ctx.command("头壳进度 <order_number:string>").action(async ({ session }, order_number) => {
    if (!order_number) {
      session.send("请提供订单编号。");
      return;
    }
    try {
      const response = await fetch(`https://kigurumi.shamiko.cc/?order_number=${order_number}`);
      if (response.status === 500) {
        session.send("订单编号不合法，请检查后重新输入。");
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const result = {
        productionBatch: data["生产批次"],
        id: data["ID"],
        orderNumber: data["订单编号"],
        currentProgress: data["当前进度"],
        description: data["描述"],
        updateTime: data["更新时间"]
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
      console.error("Error fetching data:", error);
      session.send("获取订单信息时出错，请稍后再试。");
    }
  });
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  name
});
