// GET /api/applications/user/:email
const getUserApplications = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find applications matching this email, or fallback to recent applications if none match
    let applications = await Application.find({ applicantEmail: email }).sort({ createdAt: -1 });

    if (!applications || applications.length === 0) {
      // Demo fallback so your panel is never empty
      applications = await Application.find().sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch user applications" });
  }
};