'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/', controller.home.index);
  router.post('/getqr',controller.home.getQR);
  router.post('/voice2txt',controller.home.voice2txt);

  router.post('/uploadimg',controller.uploadFile.uploadImg)
  router.post('/uploadvoice',controller.uploadFile.uploadVoice)
  router.post('/uploadvideo',controller.uploadFile.uploadVideo)
  router.post('/uploadChatFile',controller.uploadFile.uploadChatFile)
  router.post('/uploadAvatar',controller.uploadFile.uploadAvatar)

  router.get('/emoji/get',controller.emoji.get);
};
