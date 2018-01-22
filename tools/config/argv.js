const argv = {
  isDebug: !process.argv.includes('--release'),
  isMap: process.argv.includes('--map'),
  isAnalyse: process.argv.includes('--analyse'),
}

export default argv
