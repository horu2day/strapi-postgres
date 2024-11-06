"use strict";
const index = require("@strapi/plugin-users-permissions/strapi-admin");
const { sanitize } = require("@strapi/utils");
const transfer = require("../routes/transfer");

/**
 * Transfer 컨트롤러
 */
module.exports = {
  transfer: async (ctx) => {
    try {
      const {
        data: { sender, receiver, amount },
      } = ctx.request.body;
      console.log("Transfer function called"); // 로그 추가
      // 입력값 검증
      if (!sender || !receiver || !amount) {
        return ctx.badRequest("필수 필드가 누락되었습니다.");
      }

      // 숫자 변환 및 유효성 검사
      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        return ctx.badRequest("유효한 금액을 입력하세요.");
      }

      // 발신자와 수신자 계좌 조회
      const senderAccount = await strapi.services.accounts.findOne({
        name: sender,
      });
      const receiverAccount = await strapi.services.accounts.findOne({
        name: receiver,
      });

      if (!senderAccount || !receiverAccount) {
        return ctx.badRequest("발신자 또는 수신자 계좌를 찾을 수 없습니다.");
      }

      // 발신자 잔액 확인
      if (senderAccount.balance < transferAmount) {
        return ctx.badRequest("발신자의 잔액이 부족합니다.");
      }

      // 트랜잭션 생성
      await strapi.services.transacts.create({
        sender: senderAccount.name,
        receiver: receiverAccount.name,
        amount: transferAmount,
        date: new Date(),
      });

      // 계좌 잔액 업데이트
      await strapi.services.accounts.update(
        { id: senderAccount.id },
        { balance: senderAccount.balance - transferAmount }
      );
      await strapi.services.accounts.update(
        { id: receiverAccount.id },
        { balance: receiverAccount.balance + transferAmount }
      );

      ctx.send({ message: "송금이 완료되었습니다." });
    } catch (error) {
      console.error("송금 중 오류 발생:", error);
      ctx.internalServerError("송금 처리 중 오류가 발생했습니다.");
    }
  },
};
