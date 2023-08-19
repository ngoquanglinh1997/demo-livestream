import express from 'express';
import { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } from 'agora-access-token';

const router = express.Router();

var expirationTimeInSeconds = 3600;

export default function (io) {
    router.post('/subscriber', function (req, res) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
        const { uid, channel } = req.body;
        let role = RtcRole.SUBSCRIBER;
        const token = RtcTokenBuilder.buildTokenWithUid(process.env.APP_ID, process.env.APP_CERTIFICATE, channel, uid, role, privilegeExpiredTs);
        role = role == RtcRole.PUBLISHER ? "host" : "audience";
        return res.json({ appId: process.env.APP_ID, token, channel, role, uid }).send();
    });

    router.post('/publisher', function (req, res) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
        const { uid, channel } = req.body;
        let role = RtcRole.PUBLISHER;
        const token = RtcTokenBuilder.buildTokenWithUid(process.env.APP_ID, process.env.APP_CERTIFICATE, channel, uid, role, privilegeExpiredTs);
        role = role == RtcRole.PUBLISHER ? "host" : "audience";
        return res.json({ appId: process.env.APP_ID, token, channel, role, uid }).send();
    });


    router.post('/chat', function (req, res) {
        io.emit('send-message', req.body);
        return res.json(req.body).send();
    });

    return router;
}
