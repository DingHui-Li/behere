'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const verify=app.middleware.verify();

  router.post('/', controller.home.index);
  router.post('/getqr',controller.home.getQR);
  router.post('/voice2txt',controller.home.voice2txt);

  router.post('/uploadimg',verify,controller.uploadFile.uploadImg)
  router.post('/uploadvoice',verify,controller.uploadFile.uploadVoice)
  router.post('/uploadvideo',verify,controller.uploadFile.uploadVideo)
  router.post('/uploadChatFile',verify,controller.uploadFile.uploadChatFile)
  router.post('/uploadAvatar',verify,controller.uploadFile.uploadAvatar)

  router.get('/emoji/get',controller.emoji.get);

  router.post('/openvidu/get-token',controller.openvidu.getToken);
  router.post('/openvidu/leave',controller.openvidu.leave)
  router.get('/openvidu/get-users',controller.openvidu.getSessionUsers)
};
