import {
  ProjectGraphContext,
  ProjectGraphNodeRecords,
  AddProjectDependency,
  DependencyType,
} from '@nrwl/workspace';

import { execSync } from 'child_process';
import { getSortedProjectNodes } from '@nrwl/workspace/src/core/project-graph';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';
import { normalize, resolve } from 'path';

export default function (
  ctx: ProjectGraphContext,
  nodes: ProjectGraphNodeRecords,
  addDependency: AddProjectDependency,
  fileRead: (s: string) => string
) {
  // sort nodes
  const sortedNodes = getSortedProjectNodes(nodes);
  // find projects that have a csproj or sln file

  Object.keys(ctx.fileMap).forEach((source) => {
    const csProj = ctx.fileMap[source].some(
      (file) => file.ext === '.csproj' || file.ext === '.sln'
    );

    if (!csProj) {
      return;
    }

    const rootPath = nodes[source].data.root;

    /**
     * Need a better way to get output from this:
        
        
        Project reference(s)
        --------------------
        ..\..\libs\dotnet-lib\dotnet-lib.csproj

    */
    const output = execSync(`dotnet list ${rootPath} reference`)
      .toString('utf-8')
      .split('\n');
    output.splice(0, 2);

    // add deps
    output.forEach((depPath) => {
      const depRootPath = normalize(
        resolve(rootPath, depPath.replace(/\\/g, '/'))
      ).replace(appRootPath + '/', '');
      const foundDep = sortedNodes.find((node) => {
        return depRootPath.startsWith(node.data.root);
      });

      if (foundDep.name === source) return;

      if (foundDep) {
        addDependency(DependencyType.static, source, foundDep.name);
      }
    });
  });
}
