const terminalStates = new Set(['DONE', 'ERROR', 'CANCELLED']);
const queueStates = new Set(['PENDING', 'SETUP_DONE', 'RUNNING'])

export const shouldReloadTimer = (jobs) => {
  if (jobs[0].status === "failed list jobs") {
    return(false)
  } else {
    let shouldReload = false
    for (var i=0; i<jobs.length; i++) {
      if (!terminalStates.has(jobs[i].status.state)) {
        shouldReload = true
      }
    }
    return(shouldReload)
  }
}

export const getJobId = (filename, jobs) => {
  if (jobs[0].status !== "failed list jobs") {
    for (var i=0; i<jobs.length; i++) {
      if (filename === jobs[i].labels.worksheet) {
        if (queueStates.has(jobs[i].status.state)) {
          return jobs[i].reference.jobId
        }
      }
    }
  }
}

// Checks for changes in job before downloading new files created
export const checkJobChanges = (res) => {
  let isChanged = false
  for (var i=0; i<res.length; i++ ) {
    if (terminalStates.has(res[i].status.state)) isChanged = true
  }
  return isChanged
}

// Set Temporary Job and then useRecursiveTimeout runs listJobs -- waits for cluster to be active in server
export const submitJob = (filename, jobs) => {
  let fillerJobs = []
  if (jobs[0].status !== 'failed list jobs') {
    for (var i=0; i<jobs.length; i++) {
      if (jobs[i].reference.jobId.startsWith('filler job')) fillerJobs.push(jobs[i])
    }
  }
  const job_filler = {
    status: {state:"PENDING"},
    labels: {worksheet: filename.replace(/\s/g, '').toLowerCase()},
    reference: {jobId: "filler job " + (fillerJobs.length+1)}
  }
  if (jobs[0].status === 'failed list jobs') {
    return([job_filler])
  } else {
    return([...jobs, job_filler])
  }
}

// Deletes temporary Job and then list Jobs then useRecursiveTimeout will be called once more (unless theres different jobs running)
export const cancelJob = (runid, jobs) => {
  let currentJob
  for (var i=0; i<jobs.length; i++) {
    if (jobs[i].reference.jobId === runId ) {
      currentJob = i
    }
  }
  let newJobs = [
    ...jobs.slice(0, currentJob),
    ...jobs.slice(currentJob+1)
  ]
  if (newJobs.length < 1) newJobs = [{status:'failed list jobs'}]
  return newJobs
}

export const updateFilesAfterTrash = (filename, files) => {
  let newFile
  for (var i=0; i<files.length; i++) {
    if (files[i].name === filename) {
      newFile = [
        ...files.slice(0,i),
        ...files.slice(i+1)
      ]
      break
    }
  }
  return newFile
}
