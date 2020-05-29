import { GetProfileResponse } from "@template/common";

export const MOCK_GET_PROFILE_RESPONSE: GetProfileResponse = {
  id: 258,
  email: "stenzel.w@husky.neu.edu",
  name: "Will Stenzel",
  photoURL:
    "https://prod-web.neu.edu/wasapp/EnterprisePhotoService/PhotoServlet?vid=CCS&er=da30ed4153a22ec0661fe08d52bf29ae29220b5a507f641dcc0a6af3862935bb43b5e2dbadff91cd1e95bd73fb867c75a7a823a4b640ba91",
  courses: [
    {
      course: {
        id: 169,
        name: "CS 2500",
      },
      role: "ta",
    },
    {
      course: {
        id: 21,
        name: "CS 4500",
      },
      role: "student",
    },
  ],
};
