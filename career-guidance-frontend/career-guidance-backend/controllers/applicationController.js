// GET /api/applications/user/:email
const getUserApplications = async (req, res) => {
  try {
    const { email } = req.params;

    const applications = await Application.find({
      applicantEmail: email.toLowerCase().trim(),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user applications",
    });
  }
};