const ECS = require('aws-sdk/clients/ecs')

const ecs = new ECS()

const delay = time => new Promise(res => setTimeout(res, time))

const pickTaskInfo = ({ tasks }) => tasks.pop()

function getServicesDetails (service, cluster) {
  return ecs.describeServices({
    services: [service],
    cluster,
  }).promise()
    .then(({ services }) => services.pop())
}

function checkIfFinished (taskArn, cluster) {
  return delay(5000)
    .then(() => ecs.describeTasks({
      tasks: [taskArn],
      cluster,
    }).promise())
    .then(pickTaskInfo)
    .then((task) => {
      console.log('Checking if is stoped ->', task.lastStatus)
      if (task.lastStatus !== 'STOPPED') {
        return checkIfFinished(taskArn, cluster)
      }
      return task
    })
}

function runTask (service) {
  return ecs.runTask({
    cluster: service.clusterArn,
    taskDefinition: service.taskDefinition,
    group: 'migration',
    launchType: service.launchType,
    networkConfiguration: service.networkConfiguration,
    overrides: {
      containerOverrides: [
        {
          name: service.serviceName,
          environment: [{
            name: 'APP_TYPE',
            value: 'migrate',
          }],
        },
      ],
    },
  }).promise()
}

getServicesDetails('superbowleto-s-stg', 'cluster-stg')
  .then(runTask)
  .then(pickTaskInfo)
  .then(({ taskArn }) => checkIfFinished(taskArn, 'cluster-stg'))
  .then(console.log)
  .catch(console.log)
