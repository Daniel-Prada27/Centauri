-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User_Profile" (
    "user_id" TEXT NOT NULL,
    "occupation" VARCHAR(50) NOT NULL,
    "location" VARCHAR(40),
    "picture" VARCHAR(200),

    CONSTRAINT "User_Profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(400) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Member" (
    "id_user" TEXT NOT NULL,
    "id_team" UUID NOT NULL,
    "role" VARCHAR(30) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id_user","id_team")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" UUID NOT NULL,
    "id_team" UUID NOT NULL,
    "id_responsible" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "priority" VARCHAR(20) NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "due_date" DATE NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subtask" (
    "id" UUID NOT NULL,
    "id_task" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "Subtask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" UUID NOT NULL,
    "id_task" UUID NOT NULL,
    "id_author" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "edited" BOOLEAN NOT NULL,
    "content" VARCHAR(300) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" UUID NOT NULL,
    "id_team" UUID NOT NULL,
    "id_author" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(400) NOT NULL,
    "due_date" DATE NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" UUID NOT NULL,
    "id_team" UUID NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "message" VARCHAR(300) NOT NULL,
    "creation_date" DATE NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NotificationMember" (
    "id_member" TEXT NOT NULL,
    "id_notification" UUID NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NotificationMember_pkey" PRIMARY KEY ("id_member","id_notification")
);

-- CreateTable
CREATE TABLE "public"."Channel" (
    "id" UUID NOT NULL,
    "id_team" UUID NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" UUID NOT NULL,
    "id_from" TEXT NOT NULL,
    "id_to" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GroupMessage" (
    "id_channel" UUID NOT NULL,
    "id_message" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "GroupMessage_pkey" PRIMARY KEY ("id_channel","id_message")
);

-- CreateTable
CREATE TABLE "public"."_EventToUser_Profile" (
    "A" UUID NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventToUser_Profile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE INDEX "Task_id_team_idx" ON "public"."Task"("id_team");

-- CreateIndex
CREATE INDEX "Subtask_id_task_idx" ON "public"."Subtask"("id_task");

-- CreateIndex
CREATE INDEX "Event_id_team_idx" ON "public"."Event"("id_team");

-- CreateIndex
CREATE INDEX "Channel_id_team_idx" ON "public"."Channel"("id_team");

-- CreateIndex
CREATE INDEX "_EventToUser_Profile_B_index" ON "public"."_EventToUser_Profile"("B");

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User_Profile" ADD CONSTRAINT "User_Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."User_Profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_id_team_fkey" FOREIGN KEY ("id_team") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_id_team_fkey" FOREIGN KEY ("id_team") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_id_responsible_fkey" FOREIGN KEY ("id_responsible") REFERENCES "public"."User_Profile"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subtask" ADD CONSTRAINT "Subtask_id_task_fkey" FOREIGN KEY ("id_task") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_id_task_fkey" FOREIGN KEY ("id_task") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_id_author_fkey" FOREIGN KEY ("id_author") REFERENCES "public"."User_Profile"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_id_team_fkey" FOREIGN KEY ("id_team") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_id_author_fkey" FOREIGN KEY ("id_author") REFERENCES "public"."User_Profile"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_id_team_fkey" FOREIGN KEY ("id_team") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationMember" ADD CONSTRAINT "NotificationMember_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "public"."User_Profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationMember" ADD CONSTRAINT "NotificationMember_id_notification_fkey" FOREIGN KEY ("id_notification") REFERENCES "public"."Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Channel" ADD CONSTRAINT "Channel_id_team_fkey" FOREIGN KEY ("id_team") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_id_from_fkey" FOREIGN KEY ("id_from") REFERENCES "public"."User_Profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_id_to_fkey" FOREIGN KEY ("id_to") REFERENCES "public"."User_Profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMessage" ADD CONSTRAINT "GroupMessage_id_channel_fkey" FOREIGN KEY ("id_channel") REFERENCES "public"."Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventToUser_Profile" ADD CONSTRAINT "_EventToUser_Profile_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventToUser_Profile" ADD CONSTRAINT "_EventToUser_Profile_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User_Profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
