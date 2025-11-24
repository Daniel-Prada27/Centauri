-- DropForeignKey
ALTER TABLE "public"."Member" DROP CONSTRAINT "Member_id_user_fkey";

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."User_Profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
