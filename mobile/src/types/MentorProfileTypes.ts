//types file for MentorProfile
// This file defines the MentorProfile interface and its implementation.

export interface Skill {
    skill_id: number;
    name: string;
    proficiency: number;
}

export interface MentorProfiletype {
    name: string;
    mail: string;
    designation: string;
    exp: number | null;
    contact: string | null;
    skillSet: Skill[];
    domain: string;

    toJSON(): object;
}

export class MentorProfileImpl implements MentorProfiletype {
    name: string;
    mail: string;
    role: string;
    exp: number | null;
    contact: string | null;
    skillSet: Skill[];
    domain: string;
    designation: string;

    constructor(
        name: string,
        mail: string,
        role: string,
        exp: number | null,
        contact: string | null,
        skillSet: Skill[],
        domain: string,
        designation:string
    ) {
        this.name = name;
        this.mail = mail;
        this.role = role;
        this.exp = exp;
        this.contact = contact;
        this.skillSet = skillSet;
        this.domain = domain;
        this.designation= designation;
    }

    static fromJSON(json: string): MentorProfiletype {
        const jsonParsed = JSON.parse(json);

        return new MentorProfileImpl(
            jsonParsed.name,
            jsonParsed.mail,
            jsonParsed.role,
            jsonParsed.exp,
            jsonParsed.contact,
            jsonParsed["Skill set"],
            jsonParsed.domain,
            jsonParsed.designation
        );
    }

    toJSON(): object {
        return {
            name: this.name,
            mail: this.mail,
            role: this.role,
            exp: this.exp,
            contact: this.contact,
            "Skill set": this.skillSet,
            domain: this.domain,
            designation: this.designation
        };
    }
}
