import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as path from 'path';

const VersionInput: string = "version";
const ConfigInput: string = "config";

export class KubeflowConfig {
    version: string
    configFile: string;
    constructor(version: string, configFile: string) {
        this.version = version;
        this.configFile = configFile;
    }

}

export function getKubeflowConfig(): KubeflowConfig {
    const v: string = core.getInput(VersionInput);
    const c: string = core.getInput(ConfigInput);
    return new KubeflowConfig(v, c)
}

export async function buildkfctl(version: string) {
    const kfctlPath: string = "/home/runner/bin";
    await io.mkdirP(kfctlPath);

    core.addPath(kfctlPath);
}

// TODO(swiftdiaries): set kubeflow version in download URL
export async function downloadKfctl(version: string) {
    const kfctlPath: string = "/home/runner/bin";
    await io.mkdirP(kfctlPath);
    console.log("making directory at: " + kfctlPath)

    let kfctlUrl: string = `https://github.com/kubeflow/kubeflow/releases/download/v0.7.0-rc.7/kfctl_v0.7.0-rc.5-27-g7f64d8b0_linux.tar.gz`;
    let downloadPath: string | null = null;
    downloadPath = await tc.downloadTool(kfctlUrl);
    console.log("downloading kfctl from: " + kfctlUrl)

    console.log("Things inside the directory: ")
    await exec.exec("ls", [downloadPath])
    let extractedFolder: string = await tc.extractTar(downloadPath, kfctlPath)
    await io.mv(extractedFolder, path.join(kfctlPath, "kfctl"))
    console.log("extracting kfctl tarball to: " + kfctlPath + "/kfctl")

    core.addPath(path.join(kfctlPath, "kfctl"))
}

export async function installKubeflow(config: string) {

}

export async function downloadKFConfig(version: string) {
    let url: string = `https://raw.githubusercontent.com/kubeflow/kubeflow/master/bootstrap/config/kfctl_k8s_istio.yaml`;
    console.log("downloading KFConfig from " + url);
    
    let downloadPath: string | null = null;
    downloadPath = await tc.downloadTool(url);
    
    const kfconfigPath: string = "/home/runner/bin";
    await io.mkdirP(kfconfigPath);
    await exec.exec("chmod", ["+x", downloadPath])
    await io.mv(downloadPath, path.join(kfconfigPath, "kfctl_k8s_istio.yaml"));

    core.addPath(kfconfigPath)
}
