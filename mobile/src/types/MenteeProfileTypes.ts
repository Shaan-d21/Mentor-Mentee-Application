export interface Skill {
    name: string;
    proficiency: number;
    skill_id: number;
}

export interface MenteeProfile {
    name: string;
    mail: string;
    designation: string;
    contact: string;
    skillSet: Skill[];

    toJSON(): object;
}

export class MenteeProfileImpl implements MenteeProfile {
    name: string;
    mail: string;
    designation: string;
    contact: string;
    skillSet: Skill[];

    constructor(
        name: string,
        mail: string,
        contact: string,
        designation: string,
        skillSet: Skill[]
    ) {
        this.name = name;
        this.mail = mail;
        this.contact = contact;
        this.designation = designation;
        this.skillSet = skillSet;
    }

    static fromJSON(json: string): MenteeProfile {
        const jsonParsed = JSON.parse(json);

        return new MenteeProfileImpl(
            jsonParsed.name,
            jsonParsed.mail,
            jsonParsed.contact,
            jsonParsed.designation,
            jsonParsed["Skill set"].map((skill: { name: string; proficiency?: number;skill_id:number}) => ({
                skill_id: skill.skill_id,
                name: skill.name,
                proficiency: skill.proficiency || 1
            }))
        );
    }

    toJSON(): object {

        return {
            name: this.name,
            mail: this.mail,
            contact: this.contact,
            designation: this.designation,
            "Skill set": this.skillSet.map(skill => ({ 
                name: skill.name, 
                skill_id: skill.skill_id,
                proficiency: skill.proficiency 
            }))
        };
    }
}