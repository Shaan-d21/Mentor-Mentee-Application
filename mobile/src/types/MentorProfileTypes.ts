//types file for MentorProfile
// This file defines the MentorProfile interface and its implementation.

export interface Skill {
    name: string;
    proficiency: number;
}

export interface MentorProfiletype {
    name: string;
    mail: string;
    role: string;
    exp: number | null;
    github_id: string | null;
    contact: string | null;
    gender: string | null;
    skillSet: Skill[];

    toJSON(): object;
}

export class MentorProfileImpl implements MentorProfiletype {
    name: string;
    mail: string;
    role: string;
    exp: number | null;
    github_id: string | null;
    contact: string | null;
    gender: string | null;
    skillSet: Skill[];

    constructor(
        name: string,
        mail: string,
        role: string,
        exp: number | null,
        github_id: string | null,
        contact: string | null,
        gender: string | null,
        skillSet: Skill[]
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

    static fromJSON(json: string): MentorProfiletype {
        const jsonParsed = JSON.parse(json);

        return new MentorProfileImpl(
            jsonParsed.name,
            jsonParsed.mail,
            jsonParsed.role,
            jsonParsed.exp,
            jsonParsed.github_id,
            jsonParsed.contact,
            jsonParsed.gender,
            jsonParsed["Skill set"]
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
            "Skill set": this.skillSet
        };
    }
}
