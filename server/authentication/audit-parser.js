function getCurrentDate () {
  return new Date().toISOString()
}

exports = module.exports = () => (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const currentDate = getCurrentDate()

  if (req.method === 'POST') {
    req.audit = {
      createdBy: ip,
      createdAt: currentDate
    }
    next()
    return
  }

  if (req.method === 'PUT') {
    req.audit = {
      updatedBy: ip,
      updatedAt: currentDate
    }
    next()
    return
  }

  next()
}
