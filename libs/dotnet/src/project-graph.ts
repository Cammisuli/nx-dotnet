import {
  ProjectGraphContext,
  ProjectGraphNodeRecords,
  AddProjectDependency,
} from '@nrwl/workspace';

export default function (
  ctx: ProjectGraphContext,
  nodes: ProjectGraphNodeRecords,
  addDependency: AddProjectDependency,
  fileRead: (s: string) => string
) {
  console.log('Hello from a project graph!');
}
