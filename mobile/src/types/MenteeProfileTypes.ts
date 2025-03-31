//types file for MenteeProfile
// This file defines the MenteeProfile interface and its implementation.


export interface Skill {
    name: string;
}

export interface MenteeProfile {
    name: string;
    mail: string;
    role: string;
    exp: number;
    github_id: string;
    contact: string;
    gender: string;
    skillSet: any;

    toJSON(): object;
}

export class MenteeProfileImpl implements MenteeProfile {
    name: string;
    mail: string;
    role: string;
    exp: number;
    github_id: string;
    contact: string;
    gender: string;
    skillSet: [];

    constructor(
        name: string,
        mail: string,
        role: string,
        exp: number,
        github_id: string,
        contact: string,
        gender: string,
        skillSet: []
    ) {
        this.name = name;
        this.mail = mail;
        this.role = role;
        this.exp = exp;
        this.github_id = github_id;
        this.contact = contact;
        this.gender = gender;
        this.skillSet = skillSet;
    }

    static fromJSON(json: string): MenteeProfile {
        const jsonParsed = JSON.parse(json);

        return new MenteeProfileImpl(
            jsonParsed.name,
            jsonParsed.mail,
            jsonParsed.role,
            jsonParsed.exp,
            jsonParsed.github_id,
            jsonParsed.contact,
            jsonParsed.gender,
            jsonParsed["Skill set"].map((((skill: { name: any; }) => {
                console.log(`Skill set is `, skill.name);
                return skill.name 
            })))
        );
    }

    toJSON(): object {
        return {
            name: this.name,
            mail: this.mail,
            role: this.role,
            exp: this.exp,
            github_id: this.github_id,
            contact: this.contact,
            gender: this.gender,
            "Skill set": this.skillSet.map(name => ({  name }))
        };
    }
}
