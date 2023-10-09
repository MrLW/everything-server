import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AreaService {

    constructor(private prisma: PrismaService) { }

    /**
     *  获取所有的省市区信息
     */
    async all(){
        const provinceList = await this.prisma.province.findMany({
            select: {
                PROVINCE_CODE: true,
                PROVINCE_NAME: true,
            }
        })
        const cityList = await this.prisma.city.findMany({
            where: {
                PROVINCE_CODE: { in: provinceList.map(province => province.PROVINCE_CODE )}
             },
            select: {
                CITY_CODE: true,
                CITY_NAME: true,
                PROVINCE_CODE: true,
            }
        })
        const cityMap = cityList.reduce((pre, cur) => Object.assign(pre, {[cur.PROVINCE_CODE]: !pre[cur.PROVINCE_CODE] ? [cur] : [...pre[cur.PROVINCE_CODE], cur] } ), {});
        const districtList = await this.prisma.district.findMany({
            where: {
                CITY_CODE: { in: cityList.map(city => city.CITY_CODE )}
            },
            select: {
                AREA_CODE: true,
                AREA_NAME: true,
                CITY_CODE: true
            }
        })

        const districtMap = districtList.reduce((pre, cur) => Object.assign(pre, {[cur.CITY_CODE]: !pre[cur.CITY_CODE] ? [cur] : [...pre[cur.CITY_CODE], cur] } ), {});

        for(const province of provinceList){
            province['children'] = cityMap[province.PROVINCE_CODE];
            province['text'] = province.PROVINCE_NAME;
            province['value'] = province.PROVINCE_CODE;
            for(const city of province['children']){
                city['children'] = districtMap[city.CITY_CODE];
                city['text'] = city.CITY_NAME;
                city['value'] = city.CITY_CODE;
                for(let district of city['children'] || []){
                    district['text'] = district.AREA_NAME;
                    district['value'] = district.AREA_CODE;
                }
            }
        }
        return provinceList;
    }
}
