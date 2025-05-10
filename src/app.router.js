import cors from 'cors'; 
import connectDb from '../DB/connection.js';
import authRouter from './modules/auth/auth.router.js';
import adminRouter from './modules/admin/admin.router.js';
import serviceRouter from './modules/service/service.router.js';
import userRouter from './modules/user/user.router.js';
import petRouter from './modules/pet/pet.router.js';
import vetRouter from './modules/vet/vet.router.js';
import couponRouter from './modules/coupon/coupon.router.js';
import appointmentRouter from './modules/appointment/appointment.router.js';
import reviewRouter from './modules/review/review.router.js';

const initApp = async(app,express)=>{

    app.use(express.json());
    app.use(cors());
    connectDb();
    app.get('/',(req,res)=>{
        return res.status(200).json({message:"welcome ... "});
    });

    app.use('/auth',authRouter);
    app.use('/admin',adminRouter);
    app.use('/services',serviceRouter);
    app.use('/users',userRouter);
    app.use('/pets',petRouter);
    app.use('/vets',vetRouter);
    app.use('/coupons',couponRouter);
    app.use('/appointments',appointmentRouter);
    app.use('/reviews',reviewRouter);


    /*app.get('*',(req,res)=>{
        return res.status(404).json({message:"page not found"});
    });*/

};

export default initApp; 