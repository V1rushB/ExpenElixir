import { BaseEntity, BeforeInsert, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from 'bcrypt';
import { Expense } from "./Expense.js";
import { Income } from "./Income.js";
import { Category } from "./Category.js";
import { Profile } from "./Profile.js";
import { Business } from "./Business.js";


@Entity()

export class Users extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255, nullable: false, unique: true })
    username: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10)
        }
    }
    @Column({ nullable: false })
    password: string;


    @OneToMany(() => Expense, expense => expense.users, { eager: true , cascade: true })
    expenses: Expense[];

    @OneToMany(() => Category, category => category.users, { eager: true , cascade: true })
    categories: Category[];

    @OneToMany(() => Income, income => income.user, { eager: true , cascade: true })
    incomes: Income[];

    @ManyToOne(() => Business, business => business.users,{eager: true})
    business: Business;

    @OneToOne(() => Profile, profile => profile.user, { eager: true , cascade: true })
    profile: Partial<Profile>;

}