import { Office } from '$models/Office'
import { Project } from '$models/Project'
import { Technology } from '$models/Technology'
import { Employee } from '$models/Employee'

export class Company {
    office: Office;
    project: Project;
    technologies: Technology[] = [];
    employees: Employee[] = [];
    projectsCompleted: Project[] = [];

    constructor(office: Office, project: Project) {
        this.office = office
        this.project = project
    }
}