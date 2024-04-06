function status(request, response) {
  response.status(200).json({ endpoint: "/api/status" });
}

export default status;
