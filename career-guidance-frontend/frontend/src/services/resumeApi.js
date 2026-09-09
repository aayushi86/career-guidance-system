export const resumeApi = {
  analyze: (formData) =>
    fetch(
      "http://localhost:5000/api/resumes/analyze",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    ).then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Resume analysis failed."
        );
      }

      return data;
    }),
};