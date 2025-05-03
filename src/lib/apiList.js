export const server = "http://127.0.0.1:4444";
// export const server = "https://c319-128-203-207-30.ngrok-free.app";

const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  uploadResume: `${server}/upload/resume`,
  uploadSchoolRecommendation: `${server}/upload/schoolrecommendation`,
  uploadLecturerRecommendation: `${server}/upload/lecturerrecommendation`,
  uploadInsuranceCover: `${server}/upload/insurancecover`,
  uploadProfileImage: `${server}/upload/profile`,
  uploadProfileVideo: `${server}/upload/profilevideo`,
  jobs: `${server}/api/jobs`,
  recommendedJobs: `${server}/api/recommended-jobs`,
  applications: `${server}/api/applications`,
  rating: `${server}/api/rating`,
  user: `${server}/api/user`,
  applicants: `${server}/api/applicants`,
  training: `${server}/api/training`,
  payment: `${server}/api/payment`,
  isPremium: `${server}/api/isPremium`,
  forgotPassword: `${server}/api/forgotPassword`,
  resetPassword: `${server}/api/resetPassword`,
  savedJobs: `${server}/api/saved-jobs`,
  saveJob: `${server}/api/save-job`,
};

export default apiList;
