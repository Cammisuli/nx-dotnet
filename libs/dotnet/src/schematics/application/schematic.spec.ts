import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { DotnetSchematicSchema } from './schema';

describe('dotnet schematic', () => {
  let appTree: Tree;
  const options: DotnetSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@cammisuli/dotnet',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('dotnet', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
