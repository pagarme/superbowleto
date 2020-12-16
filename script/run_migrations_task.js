const ECS = require('aws-sdk/clients/ecs')

const ecs = new ECS()

const delay = time => new Promise(res => setTimeout(res, time))

const [
  ,
  ,
  serviceName,
  clusterName,
] = process.argv

const pickTaskInfo = ({ tasks }) => tasks.pop()

function getServicesDetails (service, cluster) {
  return ecs.describeServices({
    services: [service],
    cluster,
  }).promise()
    .then(({ services }) => services.pop())
}

function getLastTaskDefinition (name) {
  return ecs.describeTaskDefinition({
    taskDefinition: name,
  }).promise()
}

function checkIfFinished (taskArn, cluster) {
  return delay(5000)
    .then(() => ecs.describeTasks({
      tasks: [taskArn],
      cluster,
    }).promise())
    .then(pickTaskInfo)
    .then((task) => {
      console.log('Checking if task is stoped ->', task.lastStatus)
      if (task.lastStatus !== 'STOPPED') {
        return checkIfFinished(taskArn, cluster)
      }
      return task
    })
}

function runTask ([
  service,
  taskDefinitionResponse,
]) {
  console.log('Started task')
  return ecs.runTask({
    cluster: service.clusterArn,
    taskDefinition: taskDefinitionResponse.taskDefinition.taskDefinitionArn,
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

Promise.all([
  getServicesDetails(serviceName, clusterName),
  getLastTaskDefinition(serviceName),
])
  .then(runTask)
  .then(pickTaskInfo)
  .then(({ taskArn }) => checkIfFinished(taskArn, clusterName))
  .then(console.log)

