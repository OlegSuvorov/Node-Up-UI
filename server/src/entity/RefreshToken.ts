import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    token!: string

    @Column({ default: true })
    isValid!: boolean

    @ManyToOne(() => User, user => user.refreshTokens)
    user!: User

    @CreateDateColumn()
    createdAt!: Date
}
