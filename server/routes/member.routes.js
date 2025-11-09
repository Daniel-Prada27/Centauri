import express from 'express'
import * as controller from '#server/controllers/member.controller.js'
import * as SchemaValidation from '#server/middleware/validateSchema.js'
import * as ValidateSession from '#server/middleware/validateSession.js'

export const memberRouter = express.Router();

memberRouter.post('/invite',
    ValidateSession.validateSession,
    SchemaValidation.validateMemberInvite,
    controller.inviteMember
);

memberRouter.put('/invite/accept',
    ValidateSession.validateSession,
    SchemaValidation.validateMemberInvite,
    controller.acceptInvite
);

memberRouter.delete('/invite/reject',
    ValidateSession.validateSession,
    SchemaValidation.validateMemberInvite,
    controller.rejectInvite
);

memberRouter.get('/:teamId',
    ValidateSession.validateSession,
    controller.readAllMembers
);

memberRouter.put('',
    ValidateSession.validateSession,
    SchemaValidation.validateMember,
    controller.updateMember
);

memberRouter.delete('',
    ValidateSession.validateSession,
    SchemaValidation.validateMemberInvite,
    controller.deleteMember
);

memberRouter.delete('/leave',
    ValidateSession.validateSession,
    SchemaValidation.validateMemberInvite,
    controller.leave
);
