export const terminalStates = new Set(['DONE', 'ERROR', 'CANCELLED']);
const queueStates = new Set(['PENDING', 'SETUP_DONE', 'RUNNING']);

// export function shouldReloadTimer(jobs) {
//   if (jobs[0].status === 'failed list jobs') {
//     return false;
//   }
//   let shouldReload = false;
//   for (let i = 0; i < jobs.length; i += 1) {
//     if (!terminalStates.has(jobs[i].status.state)) {
//       shouldReload = true;
//     }
//   }
//   return shouldReload;
// }

export function shouldReloadTimer(jobs) {
  if (jobs[0].status === 'failed list jobs') return (false);

  return jobs.some((job) => !terminalStates.has(job.status.state));
}

export function getJobId(worksheetname, jobs) {
  if (jobs[0].status !== 'failed list jobs') {
    for (let i = 0; i < jobs.length; i += 1) {
      if (worksheetname === jobs[i].labels.worksheet
        && queueStates.has(jobs[i].status.state)) {
        return jobs[i].reference.jobId;
      }
    }
  }
}

// Checks for changes in job before downloading new files created
export function checkJobChanges(res) {
  let isChanged = false;
  for (let i = 0; i < res.length; i += 1) {
    if (terminalStates.has(res[i].status.state)) isChanged = true;
  }
  return isChanged;
}

// Set Temporary Job and then useRecursiveTimeout runs listJobs
// waits for cluster to be active in server
export function submitJob(worksheetname, jobs) {
  const fillerJobs = [];
  if (jobs[0].status !== 'failed list jobs') {
    for (let i = 0; i < jobs.length; i += 1) {
      if (jobs[i].reference.jobId.startsWith('filler job')) fillerJobs.push(jobs[i]);
    }
  }

  const jobFiller = {
    status: { state: 'PENDING' },
    labels: { worksheet: worksheetname.replace(/\s/g, '').toLowerCase() },
    reference: { jobId: `filler job ${fillerJobs.length + 1}` },
  };

  if (jobs[0].status === 'failed list jobs') {
    return [jobFiller];
  }

  return [...jobs, jobFiller];
}

// Deletes temporary Job and then list Jobs then useRecursiveTimeout
// will be called once more (unless theres different jobs running)
export function cancelJob(runId, jobs) {
  let currentJob;
  for (let i = 0; i < jobs.length; i += 1) {
    if (jobs[i].reference.jobId === runId) {
      currentJob = i;
    }
  }

  let newJobs = [
    ...jobs.slice(0, currentJob),
    ...jobs.slice(currentJob + 1),
  ];

  if (newJobs.length < 1) newJobs = [{ status: 'failed list jobs' }];

  return newJobs;
}

export function updateFilesAfterTrash(filename, files) {
  let newFile;
  for (let i = 0; i < files.length; i += 1) {
    if (files[i].name === filename) {
      newFile = [
        ...files.slice(0, i),
        ...files.slice(i + 1),
      ];
      break;
    }
  }
  return newFile;
}
