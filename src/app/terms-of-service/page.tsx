import React from 'react'

export default function TermsOfServicePage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-center mb-8">Terms of Service</h1>

            <div className="prose prose-gray max-w-none space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">1. ยอมรับข้อกำหนดและเงื่อนไข</h2>
                    <p className="text-gray-700 leading-relaxed">
                        ยินดีต้อนรับสู่เว็บไซต์ของเรา ข้อกำหนดและเงื่อนไขนี้ ("ข้อกำหนด") มีผลบังคับใช้กับการใช้งานเว็บไซต์และบริการทั้งหมดของเรา
                        รวมถึงการให้บริการเติมเกม (Top-up Game) และบริการ Pup Social โดยการเข้าถึงหรือใช้งานเว็บไซต์ของเรา
                        คุณตกลงที่จะผูกพันตามข้อกำหนดเหล่านี้ หากคุณไม่เห็นด้วยกับข้อกำหนดใดๆ โปรดหยุดใช้งานเว็บไซต์ของเรา
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">2. คำนิยาม</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>"เรา", "ของเรา" หรือ "บริษัท" หมายถึง ผู้ให้บริการเว็บไซต์นี้</li>
                        <li>"คุณ" หรือ "ผู้ใช้" หมายถึง บุคคลที่เข้าถึงหรือใช้งานเว็บไซต์นี้</li>
                        <li>"บริการ" หมายถึง การให้บริการเติมเกมและ Pup Social ทุกประเภท</li>
                        <li>"เนื้อหา" หมายถึง ข้อความ รูปภาพ วิดีโอ และข้อมูลอื่นๆ ที่ปรากฏบนเว็บไซต์</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">3. การใช้งานบริการ</h2>
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">3.1 คุณสมบัติการใช้งาน</h3>
                        <p className="text-gray-700 leading-relaxed">
                            คุณต้องมีอายุอย่างน้อย 18 ปี หรือได้รับความยินยอมจากผู้ปกครองหรือผู้ดูแล
                            เพื่อใช้งานบริการของเรา คุณตกลงที่จะ:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>ให้ข้อมูลที่ถูกต้องและเป็นปัจจุบัน</li>
                            <li>รักษาความลับของบัญชีและรหัสผ่าน</li>
                            <li>ไม่ใช้บริการเพื่อวัตถุประสงค์ที่ผิดกฎหมาย</li>
                            <li>ไม่พยายามเข้าถึงระบบโดยไม่ได้รับอนุญาต</li>
                            <li>ไม่แพร่กระจายไวรัสหรือมัลแวร์</li>
                        </ul>

                        <h3 className="text-lg font-medium">3.2 การสั่งซื้อและการชำระเงิน</h3>
                        <p className="text-gray-700 leading-relaxed">
                            การสั่งซื้อบริการจะสมบูรณ์เมื่อได้รับการชำระเงินครบถ้วน
                            เราใช้ระบบชำระเงินที่ปลอดภัยและรองรับวิธีการชำระเงินต่างๆ
                            รวมถึงบัตรเครดิต บัตรเดบิต และกระเป๋าเงินอิเล็กทรอนิกส์
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">4. นโยบายการคืนเงินและการยกเลิก</h2>
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">4.1 การคืนเงิน</h3>
                        <p className="text-gray-700 leading-relaxed">
                            เราไม่สามารถคืนเงินได้ในกรณีต่อไปนี้:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>บริการได้ถูกส่งมอบเรียบร้อยแล้ว</li>
                            <li>การสั่งซื้อเกิดจากความผิดพลาดของผู้ใช้</li>
                            <li>การยกเลิกหลังจากที่บริการได้เริ่มดำเนินการแล้ว</li>
                        </ul>

                        <h3 className="text-lg font-medium">4.2 การยกเลิกบริการ</h3>
                        <p className="text-gray-700 leading-relaxed">
                            คุณสามารถยกเลิกบริการได้ตลอดเวลา แต่บริการที่ได้ชำระเงินแล้ว
                            จะไม่สามารถคืนเงินได้ ยกเว้นในกรณีที่เราเป็นฝ่ายผิด
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">5. สิทธิในทรัพย์สินทางปัญญา</h2>
                    <p className="text-gray-700 leading-relaxed">
                        เว็บไซต์และเนื้อหาทั้งหมดเป็นกรรมสิทธิ์ของเรา คุณไม่ได้รับอนุญาตให้
                        คัดลอก ทำซ้ำ แจกจ่าย หรือสร้างงานอนุพันธ์โดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษร
                        เครื่องหมายการค้าและโลโก้เป็นกรรมสิทธิ์ของเราและพันธมิตร
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">6. ข้อจำกัดความรับผิดชอบ</h2>
                    <p className="text-gray-700 leading-relaxed">
                        เราไม่รับผิดชอบต่อความเสียหายทางตรง ทางอ้อม หรือพิเศษที่เกิดจากการใช้งานบริการ
                        รวมถึงการสูญเสียข้อมูล การหยุดชะงักของธุรกิจ หรือความเสียหายอื่นๆ
                        เราไม่รับประกันว่าบริการจะปราศจากข้อผิดพลาดหรือไม่หยุดชะงัก
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">7. การรักษาความปลอดภัย</h2>
                    <p className="text-gray-700 leading-relaxed">
                        เรามุ่งมั่นในการรักษาความปลอดภัยของข้อมูลผู้ใช้ อย่างไรก็ตาม
                        คุณตระหนักว่าการส่งข้อมูลทางอินเทอร์เน็ตไม่สามารถรับประกันความปลอดภัยได้ 100%
                        คุณมีหน้าที่ในการรักษาความปลอดภัยของบัญชีและรหัสผ่านของคุณเอง
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">8. การแก้ไขข้อกำหนด</h2>
                    <p className="text-gray-700 leading-relaxed">
                        เราสงวนสิทธิ์ในการแก้ไขข้อกำหนดและเงื่อนไขนี้ได้ตลอดเวลา
                        การแก้ไขจะมีผลบังคับใช้ทันทีที่ได้ประกาศบนเว็บไซต์
                        การใช้งานบริการต่อไปถือว่าคุณยอมรับข้อกำหนดที่แก้ไขแล้ว
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">9. กฎหมายที่ใช้บังคับ</h2>
                    <p className="text-gray-700 leading-relaxed">
                        ข้อกำหนดและเงื่อนไขนี้อยู่ภายใต้กฎหมายของประเทศไทย
                        ทุกข้อพิพาทจะอยู่ภายใต้เขตอำนาจของศาลไทย
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">10. การติดต่อ</h2>
                    <p className="text-gray-700 leading-relaxed">
                        หากคุณมีคำถามเกี่ยวกับข้อกำหนดและเงื่อนไขนี้
                        สามารถติดต่อเราผ่านทางอีเมลหรือช่องทางอื่นๆ ที่ระบุบนเว็บไซต์
                    </p>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <strong>วันที่แก้ไขล่าสุด:</strong> {new Date().toLocaleDateString('th-TH')}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        การใช้งานเว็บไซต์นี้ต่อไปถือว่าคุณได้อ่าน ยอมรับ และตกลงที่จะผูกพันตามข้อกำหนดและเงื่อนไขทั้งหมด
                    </p>
                </div>
            </div>
        </div>
    )
}