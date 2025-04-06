//types file for MenteeProfile
// This file defines the MenteeProfile interface and its implementation.


export interface Skill {
    name: string;
}

export interface MenteeProfile {
    name: string;
    mail: string;
    designation: string;
    contact: string;
    skillSet: any;

    toJSON(): object;
}

export class MenteeProfileImpl implements MenteeProfile {
    name: string;
    mail: string;
    designation: string;
    contact: string;
    skillSet: [];

    constructor(
        name: string,
        mail: string,
        contact: string,
        designation: string,
        skillSet: []
    ) {
        this.name = name;
        this.mail = mail;
        this.contact = contact;
        this.designation= designation;
        this.skillSet = skillSet;
    }

    static fromJSON(json: string): MenteeProfile {
        const jsonParsed = JSON.parse(json);

        return new MenteeProfileImpl(
            jsonParsed.name,
            jsonParsed.mail,
            jsonParsed.contact,
            jsonParsed.designation,
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
            contact: this.contact,
            designation: this.designation,
            "Skill set": this.skillSet.map(name => ({  name }))
        };
    }
}
