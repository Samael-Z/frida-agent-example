import frida, sys

def on_message(message, data):
    if message['type'] == 'send':
        print("[*] {0}".format(message['payload']))
    else:
        print(message)


device = frida.get_usb_device()

#device = frida.get_device_manager().add_remote_device('192.168.50.129:1234')
process = device.attach(31739)

with open('junior02.js') as f:
    jscode = f.read()
script = process.create_script(jscode)

script.on('message', on_message)
script.load()
k = 0
for i in range(20,30):
  for j in range(0,10):
    script.exports.sub(str(i),str(j))
    k = k+1
    print(k)